<?php

  // Remove PHP version
  header_remove('X-Powered-By');

  // Grab our JSON file for parsing
  $jsonurl='folding-data.json'; 
  $json = file_get_contents($jsonurl,0,null,null);  
  $data = json_decode($json, JSON_PRETTY_PRINT); 

  // echo the timestamp from the log file
  $lastgood = file_get_contents("last.log");
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <title>NETWAR Folding@Home Stats</title>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/vue/1.0.28/vue.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/page.js/1.7.1/page.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  <link href="//fonts.googleapis.com/css?family=Oswald" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="css/style.css">
</head>

<body>
  <div class="team-page" id="content">
  <div class="alert alert-info alert-dismissible fade show" role="alert">
    <strong>Stats last updated:</strong> <?php echo $lastgood; ?>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
    <div class="content">
      <h1>Team:
        <?php echo $data['name']; ?>
      </h1>
      <table class="team-info">
        <tbody>
          <tr>
            <th>Date of last work unit</th>
            <td>
              <?php echo $data['last']; ?>
            </td>
          </tr>
          <tr>
            <th>Active CPUs within 50 days</th>
            <td>
              <?php echo $data['active_50']; ?>
            </td>
          </tr>
          <tr>
            <th>Team Id</th>
            <td>
              <?php echo $data['team']; ?>
            </td>
          </tr>
          <tr>
            <th>Grand Score</th>
            <td><a href="https://apps.foldingathome.org/awards?team=237887&amp;type=score">
                <?php echo $data['credit']; ?></a></td>
          </tr>
          <tr>
            <th>Work Unit Count</th>
            <td><a href="https://apps.foldingathome.org/awards?team=237887&amp;type=wus">
                <?php echo $data['wus']; ?></a></td>
          </tr>
          <tr>
            <th>Team Ranking</th>
            <td>
              <?php echo $data['rank']; ?> of
              <?php echo $data['total_teams']; ?>
            </td>
          </tr>
          <tr>
            <th>Homepage</th>
            <td><a target="_blank" href="<?php echo $data['url']; ?>">
                <?php echo $data['url']; ?></a></td>
          </tr>
        </tbody>
      </table>
      <br>
      <h1>Team members</h1>
      <table class="results">
        <tbody>
          <tr>
            <th class="rank">Rank</th>
            <th class="name">Name</th>
            <th class="credit">Credit</th>
            <th class="wus">WUs</th>
          </tr>
          <tr class="description">
            <td colspan="10"></td>
          </tr>
          <?php 
              foreach($data['donors'] as $donor) {
              
                if ($donor['rank'] == null) {
                  $donor['rank'] = "N/A";
                } 

                echo '<tr class="user">';
                echo '  <td class="rank">'.$donor['rank'].'</td>';
                echo '  <td class="name"><a href="https://stats.foldingathome.org/donor/'.$donor['id'].'">'.$donor['name'].'</a></td>';
                echo '  <td class="credit"><a>'.number_format($donor['credit']).'</a></td>';
                echo '  <td class="wus"><a>'.$donor['wus'].'</a></td>';
                echo '</tr>';
              }
            ?>
        </tbody>
      </table>
    </div>
  </div>
</div>
<div class="alert alert-success" role="alert">
  <a href="folding-data.json" class="alert-link">JSON available here</a>.
</div>
</body>

</html>
